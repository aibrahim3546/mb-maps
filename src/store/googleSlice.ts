import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import googleApi, { IPlace } from '../api/googleApi'

export interface IGoogleState {
  places: IPlace[],
  placesHistory: IPlace[]
}

const initialState: IGoogleState = {
  places: [],
  placesHistory: []
}

export const fetchGooglePlaces = createAsyncThunk(
  'google/fetchPlaces',
  async (input: string): Promise<IPlace[]> => {
    const resp = await googleApi.getPlacesAutocomplete(input)
    return resp
  }
)

export const googleSlice = createSlice({
  name: 'google',
  initialState,
  reducers: {
    addPlacesHistory: (state, action: PayloadAction<IPlace>) => {
      const place = action.payload
      const findPlaceIndex = state.placesHistory.findIndex((each) => each.place_id === place.place_id);

      if (findPlaceIndex > -1) {
        state.placesHistory.splice(findPlaceIndex, 1)
      }

      state.placesHistory.unshift(place)
    },
    updatePlaces: (state, action: PayloadAction<IPlace[]>) => {
      state.places = [...action.payload]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGooglePlaces.fulfilled, (state, action) => {
      state.places = [...action.payload]
    })
  }
})

// Action creators are generated for each case reducer function
export const { updatePlaces, addPlacesHistory } = googleSlice.actions

export default googleSlice.reducer
