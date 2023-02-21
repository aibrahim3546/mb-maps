import React, { useEffect, useState } from 'react';
import { Box, Grid, Autocomplete, TextField, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useDebounce } from 'usehooks-ts';

// Script
import loadGoogleApiScript from './script/loadGoogleApiScript';

// API
import googleApi, { IPlace } from './api/googleApi'

// Hooks
import { useAppDispatch, useAppSelector } from './hooks';

// Store
import { addPlacesHistory, fetchGooglePlaces, updatePlaces } from './store/googleSlice';

const App = () => {
  const dispatch = useAppDispatch()

  const places = useAppSelector((state) => state.google.places)
  const placesHistory = useAppSelector((state) => state.google.placesHistory)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')
  const debouncedValue = useDebounce<string>(value, 500)

  useEffect(() => {
    const script = loadGoogleApiScript()

    return () => {
      script.remove()
    }
  }, [])

  useEffect(() => {
    if (debouncedValue) {
      findPlaces()
    }
  }, [debouncedValue])

  const findPlaces = async () => {
    setIsLoading(true)
    await dispatch(fetchGooglePlaces(debouncedValue)).unwrap()
    setIsLoading(false)
  }

  const onInputChange = (_: React.SyntheticEvent<Element, Event>, value: string) => {
    if (!value) {
      dispatch(updatePlaces(placesHistory))
    }

    setValue(value)
  }

  const onChange = (_: React.SyntheticEvent<Element, Event>, place: IPlace | null) => {
    if (place) {
      fetchGeoLocation(place?.place_id || '')
      // Update history
      dispatch(addPlacesHistory(place))
    }
  }

  const fetchGeoLocation = async (placeId: string) => {
    const result = await googleApi.getGeolocation(placeId)
    googleApi.setMarker(placeId, result[0].geometry.location)
  }

  const onClickHistory = (place: IPlace) => {
    fetchGeoLocation(place.place_id)
  }

  const renderAutoComplete = () => (
    <Autocomplete
      onInputChange={onInputChange}
      onChange={onChange}
      isOptionEqualToValue={(option, value) => option.place_id === value.place_id}
      fullWidth
      loading={isLoading}
      getOptionLabel={(option) => option.description || ''}
      renderInput={(params) => (
        <TextField {...params} label="Search..." fullWidth />
      )}
      noOptionsText="Start typing"
      options={places}
    />
  )

  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid item sm={0} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box padding={10} paddingBottom={1}>
            <Typography variant="h3" fontWeight="bold" paddingBottom={2}>
              G-Maps Autocomplete
            </Typography>

            {renderAutoComplete()}
          </Box>

          {placesHistory.length > 0 && (
            <Box padding={10}>
              <Typography variant="subtitle1" fontWeight="bold" paddingBottom={2}>
                History
              </Typography>

              <List>
                {placesHistory.map((place) => (
                  <ListItem disablePadding divider key={place.place_id}>
                    <ListItemButton onClick={() => onClickHistory(place)}>
                      <ListItemText primary={place.description} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container>
            <Grid
              item
              padding={2}
              xs={12}
              md={0}
              sx={{ display: { md: 'none', sm: 'block' } }}
            >
              <Typography variant="subtitle2" fontWeight="bold" paddingBottom={2}>
                G-Maps Autocomplete
              </Typography>
              {renderAutoComplete()}
            </Grid>
            <Grid item xs={12}>
              <div id="map" style={{ height: '100vh', width: '100%' }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
