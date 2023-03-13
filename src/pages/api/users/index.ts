import { NextApiRequest, NextApiResponse } from "next";

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    {id: 1, nome: "Guilherme"},
    {id: 2, nome: "Joao"},
    {id: 3, nome: "Maria"},
  ];

  return response.json(users);
}
