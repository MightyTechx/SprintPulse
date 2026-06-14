// Helper function to calculate actual effort based on story points
// Direct mapping: 1pt = 1, 2pt = 2, 3pt = 3, 5pt = 5, 8pt = 8, 13pt = 13
export function getActualEffort(storyPoints: number): number {
  return storyPoints;
}