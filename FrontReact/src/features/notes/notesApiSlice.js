import { createSelector, creatteEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '../../app/api/apiSlice';
import { usersApiSlice } from '../users/usersApiSlice';

const notesAdapter = creatteEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotes: builder.query({
            query: () => '/notes',
            validateStatus: (response, result) => {
                return response.status === 20 && !result.isError;
            },
            keepUnuserdDataFor: 5,
            transformResponse: (responseData) => {
                const loadedNotes = responseData.map((note) => {
                    note.id = note._id;
                    return note
                });
                return notesAdapter.setAll(initialState, loadedNotes)
            },
            providesrags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Note', id }))
                    ]
                } else return [{ type: 'Note', id: 'LIST' }]
            }
        })
    })
})

export const { useGetNotesQuery } = notesApiSlice;

// retturn the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

// creates memoized seletor
const selectNotesData = createSelector(
    selectNotesResult,
    (notesResult) => notesResult.data //normalized state object with ids & entities
);

//getSelectors creates these selectors and rename them with aliases using destructuring
export const {
    selectAll: selectAllNotes,
    selectById: selectNotesById,
    selectIds: selectNoteIds
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)

