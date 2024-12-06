export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  return <div>Property: {slug}</div>;
}
