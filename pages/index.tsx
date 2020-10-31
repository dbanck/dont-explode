import Card from "../components/card/Card";

const Home: React.FC = () => {
  return (
    <div>
      <Card
        title="Booom!"
        description="Here's some card event description"
        imageUrl="https://images.unsplash.com/photo-1530433331547-e064ffe8eef1?&auto=format&fit=crop&w=300"
      />
    </div>
  );
};

export default Home;
