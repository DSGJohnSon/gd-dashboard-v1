export type CompaniesSchemaReturned = {
  total: number;
  data: Array<{
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    siret: string;
    country: string;
    userIds: string[];
  }>;
};
