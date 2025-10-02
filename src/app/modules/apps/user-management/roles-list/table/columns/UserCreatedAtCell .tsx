import { FC } from "react";

type Props = {
  last_login?: string;
};

const UserCreatedAtCell: FC<Props> = ({ last_login }) => (
  <span>{last_login}</span>
);

export { UserCreatedAtCell };
