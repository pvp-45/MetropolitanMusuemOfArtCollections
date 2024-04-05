import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { ListGroup, Button, Card } from 'react-bootstrap';
import { searchHistoryAtom } from '../store';
import { getHistory, removeFromHistory } from '../lib/userData';
import styles from '@/styles/History.module.css';

export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistory();
        setSearchHistory(history);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [setSearchHistory]);

  const historyClicked = (queryString) => {
    router.push(`/artwork?${queryString}`);
  };

  const removeHistoryClicked = async (index) => {
    try {
      await removeFromHistory(searchHistory[index]);
      const updatedHistory = await getHistory();
      setSearchHistory(updatedHistory);
    } catch (error) {
      console.error('Error removing history item:', error);
    }
  };

  if (loading) {
    return <div>Loading history...</div>;
  }

  return (
    <div>
      {searchHistory && searchHistory.length > 0 ? (
        <ListGroup>
          {searchHistory.map((queryString, index) => (
            <ListGroup.Item
              key={index}
              className={styles.historyListItem}
              onClick={() => historyClicked(queryString)}
            >
              Query: <strong>{queryString}</strong>
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeHistoryClicked(index);
                }}
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Card>
          <Card.Body>Nothing Here. Try searching for some artwork.</Card.Body>
        </Card>
      )}
    </div>
  );
}
