import { createColumnHelper } from '@tanstack/vue-table'
import { RouterLink } from 'vue-router'
import type { DataTableFeatures } from '@/types/features'
import type { Tables } from '../../../database/types'
import DataTableSearchHeader from '@/components/ui/data-table/DataTableSearchHeader.vue'

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Tables<'yesang_tests'>>()

export const yesangsColumns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: '일련번호',
  }),
  columnHelper.accessor('subject', {
    header: '분류',
  }),
  columnHelper.accessor('subtitle', {
    header: '세부분류',
  }),
  columnHelper.accessor('question', {
    header: ({ column }) => h(DataTableSearchHeader, { title: '문제', column }),
    filterFn: 'includesString',
    cell: ({ row }) =>
      h(
        RouterLink,
        {
          to: { name: '/jodalsa/[id]', params: { id: row.original.id } },
          class: 'hover:underline',
        },
        () => row.original.question,
      ),
  }),
])
