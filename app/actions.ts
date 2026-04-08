'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

function text(formData: FormData, key: string) {
  return (formData.get(key) as string | null)?.trim() ?? '';
}

export async function createProject(formData: FormData) {
  const supabase = getSupabase();
  const payload = {
    name: text(formData, 'name'),
    description: text(formData, 'description') || null,
    status: text(formData, 'status') || 'active',
    due_date: text(formData, 'due_date') || null
  };
  const { data, error } = await supabase.from('projects').insert(payload).select('id').single();
  if (error) throw new Error(error.message);
  revalidatePath('/projects');
  redirect(`/projects/${data.id}`);
}

export async function updateProject(formData: FormData) {
  const supabase = getSupabase();
  const id = text(formData, 'id');
  const updates = {
    name: text(formData, 'name'),
    description: text(formData, 'description') || null,
    status: text(formData, 'status'),
    due_date: text(formData, 'due_date') || null
  };
  const { error } = await supabase.from('projects').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/projects');
  revalidatePath(`/projects/${id}`);
}

export async function createTask(formData: FormData) {
  const supabase = getSupabase();
  const projectId = text(formData, 'project_id');
  const payload = {
    project_id: projectId,
    title: text(formData, 'title'),
    description: text(formData, 'description') || null,
    status: text(formData, 'status') || 'todo',
    due_date: text(formData, 'due_date') || null
  };
  const { error } = await supabase.from('tasks').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath(`/projects/${projectId}`);
}

export async function updateTaskStatus(formData: FormData) {
  const supabase = getSupabase();
  const id = text(formData, 'id');
  const projectId = text(formData, 'project_id');
  const { error } = await supabase.from('tasks').update({ status: text(formData, 'status') }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath(`/projects/${projectId}`);
}

export async function createAsset(formData: FormData) {
  const supabase = getSupabase();
  const projectId = text(formData, 'project_id');
  const payload = {
    project_id: projectId,
    title: text(formData, 'title'),
    asset_type: text(formData, 'asset_type'),
    external_file_url: text(formData, 'external_file_url'),
    description: text(formData, 'description') || null
  };
  const { error } = await supabase.from('assets').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath(`/projects/${projectId}`);
}

export async function createAssetVersion(formData: FormData) {
  const supabase = getSupabase();
  const projectId = text(formData, 'project_id');
  const payload = {
    asset_id: text(formData, 'asset_id'),
    version_number: text(formData, 'version_number'),
    notes: text(formData, 'notes') || null,
    status: text(formData, 'status') || 'draft',
    external_file_url: text(formData, 'external_file_url')
  };
  const { error } = await supabase.from('asset_versions').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath(`/projects/${projectId}`);
}

export async function createApproval(formData: FormData) {
  const supabase = getSupabase();
  const projectId = text(formData, 'project_id');
  const payload = {
    version_id: text(formData, 'version_id'),
    status: text(formData, 'status'),
    reviewer: text(formData, 'reviewer') || null,
    comment: text(formData, 'comment')
  };
  const { error } = await supabase.from('approvals').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath(`/projects/${projectId}`);
}
