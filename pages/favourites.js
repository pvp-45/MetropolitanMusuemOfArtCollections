import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { favouritesAtom } from '../store'; 
import { getFavourites } from '../lib/userData';
import { Row, Col, Container } from 'react-bootstrap';
import ArtworkCardDetail from '../components/ArtworkCardDetail';

export default function Favourites() {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  useEffect(() => {
    const fetchFavourites = async () => {
      const fetchedFavourites = await getFavourites();
      setFavouritesList(fetchedFavourites);
    };
    fetchFavourites();
  }, []);

  if (!favouritesList) return <div>Loading favourites...</div>;

  return (
    <Container className="mt-5">
      <h1>Favourites</h1>
      {favouritesList.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {favouritesList.map((id) => (
            <Col key={id}>
              <ArtworkCardDetail objectID={id} />
            </Col>
          ))}
        </Row>
      ) : (
        <p>No favourites yet. Start adding some!</p>
      )}
    </Container>
  );
}
