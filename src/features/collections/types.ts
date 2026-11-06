export type CollectionSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: "private" | "public";
  createdAt: string;
  updatedAt: string;
  itemCount: number;
};

export type CollectionItemView = {
  id: string;
  notes: string | null;
  createdAt: string;
  tattoo: {
    id: string;
    title: string;
    slug: string;
    imagePath: string;
    imageAlt: string | null;
  } | null;
  aiGeneration: {
    id: string;
    title: string | null;
    concept: string | null;
    kind: string;
  } | null;
};

export type CollectionDetail = CollectionSummary & {
  items: CollectionItemView[];
};
