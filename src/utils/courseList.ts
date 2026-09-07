export interface CourseItem {
  title: string
  /** Supabase Storage bucket holding this subject's materials (one bucket per subject). */
  storageBucket: string
  children: string[]
}

export const courseList: CourseItem[] = [
  {
    title: 'Ⅰ. 공공조달과 법제도 이해(30문)',
    storageBucket: 'jodal_subject_1',
    children: [
      '1. 공공조달 개요',
      '2. 공공조달 원칙 및 방법',
      '3. 전자조달시스템',
      '4. 전략적 공공조달',
      '5. 공공조달법률 이해',
      '6. 공공조달 관리',
    ],
  },
  {
    title: 'Ⅱ. 공공조달 계획수립 및 분석(20문)',
    storageBucket: 'jodal_subject_2',
    children: ['1. 공공조달계획', '2. 조달요구 응대 및 제안', '3. 입찰·제안평가 및 계약체결'],
  },
  {
    title: 'Ⅲ. 공공계약관리(30)',
    storageBucket: 'jodal_subject_3',
    children: [
      '1. 계약관리 일반 절차',
      '2. 물품 계약관리',
      '3. 용역·다수공급자 계약관리',
      '4. 공사계약관리',
      '5. 공공조달 품질관리 등',
    ],
  },
]

/** Each subtitle's material lives at `subtitle_<n>/subtitle_<n>.pdf` within its subject's bucket, 1-indexed. */
export const courseMaterialPath = (subtitleIndex: number) => {
  const no = subtitleIndex + 1
  return `subtitle_${no}/subtitle_${no}.pdf`
}

export interface FlatMaterialItem {
  title: string
  storageBucket: string
  path: string
}

export const coreRegulationList: FlatMaterialItem[] = [
  { title: '국가계약법', storageBucket: 'jodal_subject_5', path: courseMaterialPath(0) },
  { title: '다수공급자 계약제도', storageBucket: 'jodal_subject_5', path: courseMaterialPath(1) },
]

export const practicalMaterialList: FlatMaterialItem[] = [
  { title: '공공조달 계획', storageBucket: 'jodal_subject_4', path: courseMaterialPath(0) },
  { title: '입찰및 계약관리', storageBucket: 'jodal_subject_4', path: courseMaterialPath(1) },
  { title: '종합쇼핑목 활용', storageBucket: 'jodal_subject_4', path: courseMaterialPath(2) },
]
