import { FC } from "react";

type Props = {
  phone: [];
};

const UserPhoneCell: FC<Props> = ({ phone }) => {
  // console.log("phone",phone)
  return (
    <div>
      {phone?.map((perm) => {
        return (
          <div>
            {perm?.permission?.name}{" "}
            {perm?.access?.length !== 0 && perm?.permission !== null
              ? perm?.access?.length == 3
                ? "- full access"
                : "- limited access"
              : ""}
          </div>
        );
      })}
    </div>
  );
};

export { UserPhoneCell };
