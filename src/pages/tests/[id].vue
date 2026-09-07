<script setup lang="ts">
import { useJodalsaStore } from '@/stores/loaders/jodalsa'

const { id } = useRoute('/jodalsa/[id]').params

const josalsaLoader = useJodalsaStore()
const { yesang } = storeToRefs(josalsaLoader)
const { getTest, updateTest } = josalsaLoader

await getTest(Number(id))

const commitUpdate = () => {
  if (!yesang.value) return
  updateTest(yesang.value)
}
</script>

<template>
  <div>
    <Table v-if="yesang">
      <TableRow>
        <TableHead> 분류 </TableHead>
        <TableCell>
          <AppInPlaceEditText v-model="yesang.subject" @commit="commitUpdate" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> 세분류 </TableHead>
        <TableCell>
          <AppInPlaceEditText v-model="yesang.subtitle" @commit="commitUpdate" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> 질문 </TableHead>
        <TableCell>
          <AppInPlaceEditText v-model="yesang.question" @commit="commitUpdate" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> 가 </TableHead>
        <TableCell>
          <AppInPlaceEditText v-model="yesang.ga" @commit="commitUpdate" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> 나 </TableHead>
        <TableCell>
          <AppInPlaceEditText v-model="yesang.na" @commit="commitUpdate" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> 다 </TableHead>
        <TableCell>
          <AppInPlaceEditText v-model="yesang.da" @commit="commitUpdate" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> 라 </TableHead>
        <TableCell>
          <AppInPlaceEditText v-model="yesang.la" @commit="commitUpdate" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> 정답 </TableHead>
        <TableCell>
          <AppInPlaceEditText v-model="yesang.answer" @commit="commitUpdate" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> 해설 </TableHead>
        <TableCell>
          <AppInPlaceEditText v-model="yesang.explanation" @commit="commitUpdate" />
        </TableCell>
      </TableRow>
    </Table>
  </div>
</template>
