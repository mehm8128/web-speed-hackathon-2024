import type { ComponentProps } from 'react';
import { Link as ReactLink } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
} & ComponentProps<typeof ReactLink>;

export const Link: React.FC<Props> = ({ children, to, ...rest }) => {
  return (
    <ReactLink to={to} {...rest}>
      {children}
    </ReactLink>
  );
};
