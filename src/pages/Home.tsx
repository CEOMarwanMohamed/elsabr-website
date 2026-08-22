import { About } from '../components/About';
import { Categories } from '../components/Categories';
import { Clients } from '../components/Clients';
import { Commitments } from '../components/Commitments';
import { Hero } from '../components/Hero';
import { Problems } from '../components/Problems';
import { Process } from '../components/Process';
import { QuoteForm } from '../components/QuoteForm';

export default function Home() {
  return (
    <>
      <Hero />
      <Clients />
      <Commitments />
      <Categories />
      <Process />
      <Problems />
      <About />
      <QuoteForm />
    </>
  );
}
