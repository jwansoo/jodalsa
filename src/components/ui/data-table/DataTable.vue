<script setup lang="ts" generic="TData extends RowData">
import type { ColumnDef, RowData } from '@tanstack/vue-table'
import { FlexRender, useTable } from '@tanstack/vue-table'
import { features, type DataTableFeatures } from '@/types/features'

const props = defineProps<{
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
}>()

const table = useTable({
  features,
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 15,
    },
  },
})
</script>

<template>
  <div class="border rounded-md">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
          class="font-bold"
        >
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender v-if="!header.isPlaceholder" :header="header" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :cell="cell" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center"> No results. </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
  <div class="flex items-center justify-end gap-2 py-4">
    <div class="text-sm text-muted-foreground mr-auto">
      {{ table.atoms.pagination.get().pageIndex + 1 }} /
      {{ Math.max(table.getPageCount(), 1) }} 페이지
    </div>
    <Button
      variant="outline"
      size="sm"
      :disabled="!table.getCanPreviousPage()"
      @click="table.previousPage()"
    >
      이전
    </Button>
    <Button
      variant="outline"
      size="sm"
      :disabled="!table.getCanNextPage()"
      @click="table.nextPage()"
    >
      다음
    </Button>
  </div>
</template>
