import { createHashRouter } from 'react-router';

function Placeholder({ name }) {
  return (
    <div className="flex h-screen items-center justify-center font-display text-2xl text-brand">
      {name}
    </div>
  );
}

export const router = createHashRouter([
  {
    path: '/',
    element: <Placeholder name="Home" />,
  },
  {
    path: '*',
    element: <Placeholder name="404" />,
  },
]);
