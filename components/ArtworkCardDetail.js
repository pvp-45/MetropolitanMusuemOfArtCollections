import useSWR from 'swr';
import { useState, useEffect } from 'react'; 
import { useAtom } from 'jotai'; 
import { favouritesAtom } from '../store'; 
import { Card, Button } from 'react-bootstrap';
import Error from 'next/error';
import { addToFavourites, removeFromFavourites, getFavourites } from '../lib/userData';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ArtworkCardDetail({ objectID }) {
  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null, fetcher);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    const checkFavourites = async () => {
      const favourites = await getFavourites();
      setShowAdded(favourites.includes(objectID));
    };
    checkFavourites();
  }, [objectID, favouritesList]);

  const favouritesClicked = async () => {
    if (showAdded) {
      await removeFromFavourites(objectID);
    } else {
      await addToFavourites(objectID);
    }
    const updatedFavourites = await getFavourites();
    setFavouritesList(updatedFavourites);
  };

  if (error) return <Error statusCode={404} />;
  if (!data) return <div>Loading...</div>;

  return (
    <Card style={{ width: '18rem', margin: '1rem' }}>
      {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
      <Card.Body>
        <Card.Title>{data.title || 'N/A'}</Card.Title>
        <Card.Text>
          {data.artistDisplayName || 'N/A'}, {data.objectDate || 'N/A'}
        </Card.Text>
        <Button onClick={favouritesClicked} variant={showAdded ? "danger" : "outline-primary"}>
          {showAdded ? "Remove from Favourites" : "Add to Favourites"}
        </Button>
      </Card.Body>
    </Card>
  );
}
