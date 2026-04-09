import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// GET /api/projects — List all projects
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'قاعدة البيانات غير مهيأة. يرجى إعداد متغيرات Supabase في .env' },
      { status: 503 }
    );
  }

  try {
    const client = getSupabaseAdmin();
    if (!client) return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });

    const { data, error } = await client
      .from('projects')
      .select('id, name, description, isPublic, language, created_at, updated_at, user:users(name, email)')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ projects: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/projects — Create a new project
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'قاعدة البيانات غير مهيأة' },
      { status: 503 }
    );
  }

  try {
    const { name, description, language, userId } = await request.json();

    if (!name || !userId) {
      return NextResponse.json({ error: 'اسم المشروع ومعرف المستخدم مطلوبان' }, { status: 400 });
    }

    const client = getSupabaseAdmin();
    if (!client) return NextResponse.json({ error: 'قاعدة البيانات غير مهيأة' }, { status: 503 });

    const { data, error } = await client
      .from('projects')
      .insert({ name, description, language: language || 'javascript', user_id: userId })
      .select()
      .single();

    if (error) throw error;

    // Add default files
    const defaultFiles = [
      { path: 'package.json', content: JSON.stringify({ name, version: '1.0.0', scripts: { dev: 'vite' }, devDependencies: { vite: '^5.0.0' } }, null, 2), project_id: data.id },
      { path: 'index.html', content: '<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8"><title>' + name + '</title></head>\n<body><h1>Hello World</h1></body>\n</html>', project_id: data.id },
      { path: 'README.md', content: '# ' + name + '\n\nA new Cloud-Native Studio project.', project_id: data.id },
    ];

    await client.from('project_files').insert(defaultFiles);

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
