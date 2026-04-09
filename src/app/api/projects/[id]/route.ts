import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// GET /api/projects/[id] — Get project with all files
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });
  }

  const { id } = await params;

  try {
    const client = getSupabaseAdmin();
    if (!client) return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });

    const { data: project, error: projectError } = await client
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError) throw projectError;
    if (!project) return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 });

    const { data: files, error: filesError } = await client
      .from('project_files')
      .select('id, path, content, updated_at')
      .eq('project_id', id);

    if (filesError) throw filesError;

    return NextResponse.json({ project, files: files || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/projects/[id] — Update project metadata
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const client = getSupabaseAdmin();
    if (!client) return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });

    const { data, error } = await client
      .from('projects')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/projects/[id] — Delete project and all files
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });
  }

  const { id } = await params;

  try {
    const client = getSupabaseAdmin();
    if (!client) return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });

    const { error } = await client
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'تم حذف المشروع بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
