export function getAgeModifiers(ageRange: string): string {
  switch (ageRange) {
    case "3-5":
      return "very simple shapes, ultra thick big outlines, completely solid white background, minimal details, extreme minimalism, toddler coloring book style";
    case "6-8":
      return "medium detail, friendly cute cartoon style, simple recognizable background, clear thick outlines";
    case "9-12":
      return "more detailed background, dynamic cartoon style, slightly thinner but clear outlines, easy to color comic book style";
    default:
      return "simple thick outlines, white background"; // fallback
  }
}
