import dynamic from "next/dynamic";

const UserGrid = dynamic(() => import("@/components/user/user-grid"), {
  loading: () => <p>Loading...</p>,
});

type Params = Promise<{ orgId: string }>;

export default async function OrgUserView(props: { params: Params }) {
  const params = await props.params;

  return (
    <UserGrid organizationId={Number(params.orgId)} userType="organization" />
  );
}
