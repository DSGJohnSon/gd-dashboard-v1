export type UsersSchemaReturned = {
  total: number;
  data: Array<{
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    avatarUrl: string;
    labels: string[];
    email: string;
  }>;
};
