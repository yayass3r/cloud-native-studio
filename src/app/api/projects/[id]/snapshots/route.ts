import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// GET /api/projects/[id]/snapshots — List snapshots
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
      .from('snapshots')
      .select('id, name, created_at')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ snapshots: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/projects/[id]/snapshots — Create a snapshot
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });
  }

  const { id } = await params;

  try {
    const { name, data } = await request.json();

    if (!name || !data) {
      return NextResponse.json({ error: 'اسم النسخة والبيانات مطلوبان' }, { status: 400 });
    }

    const client = getSupabaseAdmin();
    if (!client) return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });

    const { error } = await client
      .from('snapshots')
      .insert({ project_id: id, name, data: JSON.stringify(data) });

    if (error) throw error;
    return NextResponse.json({ message: 'تم إنشاء النسخة الاحتياطية' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
