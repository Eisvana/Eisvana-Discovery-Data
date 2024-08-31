<script setup lang="ts">
interface Props {
  amountOfHeaders?: number;
  dataLength?: number;
}

withDefaults(defineProps<Props>(), {
  amountOfHeaders: 6,
  dataLength: 5,
});
</script>

<template>
  <QMarkupTable flat>
    <thead>
      <tr>
        <th
          v-for="_n in amountOfHeaders"
          scope="col"
        >
          <QSkeleton type="text" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="_n in dataLength">
        <td v-for="_m in amountOfHeaders">
          <QSkeleton type="text" />
        </td>
      </tr>
    </tbody>
  </QMarkupTable>
</template>
