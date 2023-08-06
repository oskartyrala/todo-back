export interface Task {
  title: string;
  description: string;
  status: "done" | "not done" | "in progress";
}

export interface TaskWithId extends Task {
  id: number;
}

const db: TaskWithId[] = [];

/** Variable to keep incrementing id of database items */
let idCounter = 0;

/**
 * Adds in some dummy database items to the database
 *
 * @param n - the number of items to generate
 * @returns the created items
 */
export const addDummyTasks = (n: number): TaskWithId[] => {
  const createdSignatures: TaskWithId[] = [];
  for (let count = 0; count < n; count++) {
    const createdSignature = addTask({
      title: "Lorem ipsum",
      description: "Lorem ipsum dolor sit amet",
      status: "not done",
    });
    createdSignatures.push(createdSignature);
  }
  return createdSignatures;
};

/**
 * Adds in a single item to the database
 *
 * @param data - the item data to insert in
 * @returns the item added (with a newly created id)
 */
export const addTask = (data: Task): TaskWithId => {
  const newEntry: TaskWithId = {
    id: ++idCounter,
    ...data,
  };
  db.push(newEntry);
  return newEntry;
};

/**
 * Deletes a database item with the given id
 *
 * @param id - the id of the database item to delete
 * @returns the deleted database item (if originally located),
 *  otherwise the string `"not found"`
 */
export const deleteTaskById = (id: number): TaskWithId | "not found" => {
  const idxToDeleteAt = findIndexOfTaskById(id);
  if (typeof idxToDeleteAt === "number") {
    const itemToDelete = getTaskById(id);
    db.splice(idxToDeleteAt, 1); // .splice can delete from an array
    return itemToDelete;
  } else {
    return "not found";
  }
};

/**
 * Finds the index of a database item with a given id
 *
 * @param id - the id of the database item to locate the index of
 * @returns the index of the matching database item,
 *  otherwise the string `"not found"`
 */
const findIndexOfTaskById = (id: number): number | "not found" => {
  const matchingIdx = db.findIndex((entry) => entry.id === id);
  // .findIndex returns -1 if not located
  if (matchingIdx !== -1) {
    return matchingIdx;
  } else {
    return "not found";
  }
};

/**
 * Find all database items
 * @returns all database items from the database
 */
export const getAllTasks = (): TaskWithId[] => {
  return db;
};

/**
 * Locates a database item by a given id
 *
 * @param id - the id of the database item to locate
 * @returns the located database item (if found),
 *  otherwise the string `"not found"`
 */
export const getTaskById = (id: number): TaskWithId | "not found" => {
  const maybeEntry = db.find((entry) => entry.id === id);
  if (maybeEntry) {
    return maybeEntry;
  } else {
    return "not found";
  }
};

/**
 * Applies a partial update to a database item for a given id
 *  based on the passed data
 *
 * @param id - the id of the database item to update
 * @param newData - the new data to overwrite
 * @returns the updated database item (if one is located),
 *  otherwise the string `"not found"`
 */
export const updateTaskById = (
  id: number,
  newData: Partial<Task>
): TaskWithId | "not found" => {
  const idxOfEntry = findIndexOfTaskById(id);
  // type guard against "not found"
  if (typeof idxOfEntry === "number") {
    return Object.assign(db[idxOfEntry], newData);
  } else {
    return "not found";
  }
};
