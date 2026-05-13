export interface Folder {
  id: string;
  name: string;
  color: string | null;
  parent_id: string | null;
  user_id: string;
  depth: number;
  file_count: number;
  children_count: number;
  created_at: string;
  updated_at: string;
}

export interface FolderBreadcrumb {
  id: string;
  name: string;
  depth: number;
}

export interface FolderCreateOptions {
  name: string;
  parent_id?: string | null;
  color?: string | null;
}

export interface FolderUpdateOptions {
  name?: string;
  color?: string | null;
  parent_id?: string | null;
}

export interface MoveFilesOptions {
  job_ids: string[];
  folder_id: string | null;
}
