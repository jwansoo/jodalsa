import { supabase } from '@/lib/supabaseClient'
import type { CreateNewTest } from '@/types/CreateNewForm'
import type { QueryData } from '@supabase/supabase-js'
import type { TablesInsert, TablesUpdate } from 'database/types'

export const yesangQuery = (id: number) =>
  supabase.from('yesang_tests').select('*').eq('id', id).single()
export type Yesang = QueryData<ReturnType<typeof yesangQuery>>

export const yesangsQuery = supabase.from('yesang_tests').select('*')
export type Yesangs = QueryData<typeof yesangsQuery>

export const testQuery = (list: string) =>
  supabase.from('jadal_tests').select('*').eq('round', list)
export type Test = QueryData<ReturnType<typeof testQuery>>

export const testsQuery = supabase.from('jadal_tests').select('*')
export type Tests = QueryData<typeof testsQuery>

export const yesangsCountQuery = supabase
  .from('yesang_tests')
  .select('*', { count: 'exact', head: true })

export const createNewYesangsQuery = (no: number, newYesang: CreateNewTest) => {
  return supabase.from('yesang_tests').insert({ ...newYesang, no })
}

export const updateYesangQuery = (updateYesang = {}, id: number) => {
  return supabase.from('yesang_tests').update(updateYesang).eq('id', id)
}

export const profileQuery = ({ column, value }: { column: string; value: string }) => {
  return supabase.from('profiles').select('*').eq(column, value).single()
}

export const updateProfileQuery = (
  id: string,
  updates: Pick<TablesUpdate<'profiles'>, 'username' | 'full_name' | 'bio'>,
) => supabase.from('profiles').update(updates).eq('id', id).select().single()

export const upsertTestResultQuery = (result: TablesInsert<'test_results'>) => {
  return supabase.from('test_results').upsert(result, { onConflict: 'username,round' })
}

export const testResultsQuery = (username: string) =>
  supabase.from('test_results').select('*').eq('username', username)
export type TestResults = QueryData<ReturnType<typeof testResultsQuery>>

export const createInquiryThreadQuery = (thread: TablesInsert<'inquiry_threads'>) =>
  supabase.from('inquiry_threads').insert(thread).select().single()

export const inquiryThreadQuery = (id: string) =>
  supabase.from('inquiry_threads').select('*').eq('id', id).single()

export const inquiryThreadsQuery = supabase
  .from('inquiry_threads')
  .select('*')
  .order('created_at', { ascending: false })
export type InquiryThreads = QueryData<typeof inquiryThreadsQuery>

export const inquiryMessagesQuery = (threadId: string) =>
  supabase
    .from('inquiry_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
export type InquiryMessages = QueryData<ReturnType<typeof inquiryMessagesQuery>>

export const createInquiryMessageQuery = (message: TablesInsert<'inquiry_messages'>) =>
  supabase.from('inquiry_messages').insert(message).select().single()

export const courseMaterialSignedUrlQuery = (bucket: string, path: string) =>
  supabase.storage.from(bucket).createSignedUrl(path, 60)
