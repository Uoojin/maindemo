export const objectTeamInfo = [
  { team: "TEAM. 000000", media: "신규 콘텐츠 · 서비스", description: "콘텐츠 관련 설명이 들어가는 자리입니다. 서비스 소개 내용을 자유롭게 수정할 수 있습니다." },
];

export const circleTeamInfo = Array.from({ length: 17 }, (_, index) => ({
  name: `TEAM ${String(index + 1).padStart(2, '0')}`,
  category: '프로젝트 카테고리',
}));
