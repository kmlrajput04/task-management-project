import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { PageHeader, Table, Badge, EmptyState, Button, Card, Input, Textarea, Pagination } from '../components/ui';
import { Globe, Phone, Building, MapPin, Server, Cpu, Settings2, CheckCircle2, Braces } from 'lucide-react';
import { externalService } from '../services/external.service';
import { toast } from 'sonner';

export const ExternalUsersPage = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [apiHeaders, setApiHeaders] = useState('{}');
  const [isSaving, setIsSaving] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. Query external users list
  const { data: apiResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['external-users-list'],
    queryFn: async () => {
      const res = await externalService.getExternalUsers();
      return res; // returns standardized successResponse
    }
  });

  // 2. Query current Gateway Settings
  const { data: settingsResponse } = useQuery({
    queryKey: ['external-api-settings'],
    queryFn: async () => {
      const res = await externalService.getExternalSettings();
      return res.data;
    }
  });

  // Sync state values on load
  useEffect(() => {
    if (settingsResponse) {
      setApiUrl(settingsResponse.apiUrl || '');
      setApiHeaders(settingsResponse.apiHeaders || '{}');
    }
  }, [settingsResponse]);

  // 3. Save Settings Mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data) => {
      await externalService.saveExternalSettings(data);
    },
    onSuccess: () => {
      toast.success('API Gateway configured successfully');
      setCurrentPage(1); // Reset page on settings change
      refetch(); // Automatically trigger re-sync of contacts list
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update gateway settings');
    }
  });

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      // Validate headers JSON
      JSON.parse(apiHeaders);
    } catch (err) {
      toast.error('Invalid Headers format. Must be a valid JSON object.');
      return;
    }

    setIsSaving(true);
    await saveSettingsMutation.mutateAsync({ apiUrl, apiHeaders });
    setIsSaving(false);
  };

  const externalUsers = error ? [] : (apiResponse?.data || []);
  const meta = apiResponse?.meta || {};

  // Check if form values differ from active DB settings
  const hasChanges = settingsResponse ? (
    apiUrl !== (settingsResponse.apiUrl || '') ||
    apiHeaders !== (settingsResponse.apiHeaders || '{}')
  ) : false;

  // Pagination calculation
  const totalPages = Math.ceil(externalUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = externalUsers.slice(startIndex, startIndex + itemsPerPage);

  const headers = ['Name', 'Email Address', 'Phone Number', 'Company & Website', 'Location', 'Sync Source'];

  const rows = paginatedUsers.map((u) => [
    <span className="font-semibold text-slate-200">{u.name}</span>,
    <span className="text-slate-400 font-mono text-xs">{u.email}</span>,
    <div className="flex items-center gap-1 text-slate-400">
      <Phone className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-xs">{u.phone}</span>
    </div>,
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-slate-300 font-medium">
        <Building className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs">{u.company || 'N/A'}</span>
      </div>
      <div className="flex items-center gap-1 text-blue-400 hover:underline">
        <Globe className="w-3.5 h-3.5" />
        <a href={u.website?.startsWith('http') ? u.website : `https://${u.website}`} target="_blank" rel="noreferrer" className="text-[10px] font-mono">
          {u.website}
        </a>
      </div>
    </div>,
    <div className="flex items-center gap-1 text-slate-400">
      <MapPin className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-xs">{u.city || 'N/A'}</span>
    </div>,
    <Badge variant={meta.cached ? 'success' : 'info'}>
      {meta.cached ? 'Redis Cache' : 'Live Sync'}
    </Badge>
  ]);

  const headerActions = (
    <Button
      variant="outline"
      size="sm"
      leftIcon={Cpu}
      onClick={() => refetch()}
      loading={isLoading}
    >
      Sync Directory
    </Button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="External Integrations"
        description="Synchronize directory records from third-party APIs cached using Redis in-memory key-value databases"
        actions={headerActions}
        breadcrumbs={['Workspace', 'Integrations']}
      />

      {/* 1. API Gateway Config Form at the top */}
      <Card title="API Gateway Config" padding="md" className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
          <Settings2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-300">Custom Integration settings</span>
        </div>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Input
              label="API Endpoint URL"
              placeholder="e.g. https://api.mycrm.com/v1/contacts"
              required
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                label="Headers (JSON format)"
                placeholder='e.g. {"Authorization": "Bearer key"}'
                value={apiHeaders}
                onChange={(e) => setApiHeaders(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant={hasChanges ? 'primary' : 'outline'}
              loading={isSaving}
              disabled={!hasChanges || isSaving}
              leftIcon={CheckCircle2}
              className="h-10 self-end font-semibold text-xs"
            >
              {hasChanges ? 'Save & Sync' : 'Synced'}
            </Button>
          </div>
        </form>
      </Card>

      {/* 2. Database Performance Stats Bar (Full Width) */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl flex items-center gap-3">
            <Server className="w-8 h-8 text-blue-500/80 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">API Source Gateway</p>
              <p className="text-xs font-semibold text-slate-350 truncate">{meta.source || 'JSONPlaceholder'}</p>
            </div>
          </div>
          <div className="bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl flex items-center gap-3">
            <Cpu className="w-8 h-8 text-green-500/80 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Database Cache Layer</p>
              <p className="text-xs font-semibold text-slate-350">{meta.cached ? 'Active (Redis Server)' : 'Inactive (Live Query)'}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Table Directory (Full Width) */}
      <div className="relative">
        <Table
          headers={headers}
          rows={rows}
          loading={isLoading}
          error={error}
          emptyState={
            <EmptyState
              iconName="Server"
              title="No external users synced"
              description="Failed to retrieve directory records from the external API provider."
              actionLabel="Retry Synchronize"
              onActionClick={() => refetch()}
            />
          }
          striped={true}
          hover={true}
        />

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 4. Raw JSON Response Viewer at the bottom (Full Width) */}
      <Card title="Raw JSON Response" padding="md" className="flex flex-col">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80 mb-3 shrink-0">
          <Braces className="w-4 h-4 text-green-400 shrink-0 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">API Response Payload (Full View)</span>
        </div>
        <div className="max-h-80 overflow-auto bg-slate-950 p-4 rounded-xl border border-slate-800/60 text-[10px] font-mono text-green-400 scrollbar-none shadow-inner">
          {isLoading ? (
            <div className="text-slate-500 py-4 text-center">Loading payload...</div>
          ) : error ? (
            <div className="text-red-400 py-4 text-center">Error loading payload</div>
          ) : (
            <pre className="whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(externalUsers, null, 2)}
            </pre>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ExternalUsersPage;
