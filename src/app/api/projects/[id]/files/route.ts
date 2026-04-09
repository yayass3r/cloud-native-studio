import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// GET /api/projects/[id]/files — List all files in a project
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

    const { data, error } = await client
      .from('project_files')
      .select('id, path, content, updated_at')
      .eq('project_id', id)
      .order('path');

    if (error) throw error;
    return NextResponse.json({ files: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/projects/[id]/files — Save/update a file (upsert)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });
  }

  const { id } = await params;

  try {
    const { path, content } = await request.json();

    if (!path) {
      return NextResponse.json({ error: 'مسار الملف مطلوب' }, { status: 400 });
    }

    const client = getSupabaseAdmin();
    if (!client) return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });

    const { data, error } = await client
      .from('project_files')
      .upsert(
        { project_id: id, path, content: content || '' },
        { onConflict: 'project_id,path' }
      )
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ file: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/files — Delete a file
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });
  }

  const { id } = await params;

  try {
    const { path } = await request.json();
    if (!path) {
      return NextResponse.json({ error: 'مسار الملف مطلوب' }, { status: 400 });
    }

    const client = getSupabaseAdmin();
    if (!client) return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });

    const { error } = await client
      .from('project_files')
      .delete()
      .eq('project_id', id)
      .eq('path', path);

    if (error) throw error;
    return NextResponse.json({ message: 'تم حذف الملف' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
