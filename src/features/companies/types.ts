export type CompaniesSchema = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  siret: string;
  country: string;
  userIds: string[];
};

export type CompaniesSchemaReturned = {
  total: number;
  data: Array<CompaniesSchema>;
};
