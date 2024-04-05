import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { addToHistory } from '../lib/userData'; 

export default function AdvancedSearch() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  const submitForm = async (data) => { 
    const queryString = Object.entries(data).reduce((acc, [key, value]) => {
      if (value) {
        return `${acc}${acc ? '&' : ''}${key}=${encodeURIComponent(value)}`;
      }
      return acc;
    }, "");
    await addToHistory(queryString);
    setSearchHistory(current => [...current, queryString]); 
    router.push(`/artwork?${queryString}`);
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Search Query</Form.Label>
            <Form.Control type="text" placeholder="" {...register("q", { required: true })} isInvalid={errors.q} />
            <Form.Control.Feedback type="invalid">
              Search query is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Label>Search By</Form.Label>
          <Form.Select {...register("searchBy")} className="mb-3">
            <option value="title">Title</option>
            <option value="tags">Tags</option>
            <option value="artistOrCulture">Artist or Culture</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control type="text" placeholder="" {...register("geoLocation")} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control type="text" placeholder="" {...register("medium")}/>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Check
            type="checkbox"
            label="Highlighted"
            {...register("isHighlight")}
          />
          <Form.Check
            type="checkbox"
            label="Currently on View"
            {...register("isOnView")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <br />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
