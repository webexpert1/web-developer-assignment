import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
} from "./query-templates";
import { User } from "./types";

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error: Error | null, results: { count: number }) => {
        if (error) {
          reject(error);
        }
        resolve(results.count);
      }
    );
  });

export const getUsers = (
  pageNumber: number,
  pageSize: number
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    connection.all<User>(
      selectUsersTemplate,
      [pageNumber * pageSize, pageSize],
      (error: Error | null, results: User[]) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
