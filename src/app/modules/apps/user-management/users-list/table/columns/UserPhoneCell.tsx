import { FC } from "react";

type Props = {
  phone?: string;
};

const UserPhoneCell: FC<Props> = ({ phone }) => <div>{phone}</div>;

export { UserPhoneCell };
