import { action } from 'easy-peasy';

export const setFieldsSchema = action((state, payload) => {
  state.getFields = payload;
});
