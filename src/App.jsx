// eslint-disable-next-line no-unused-vars
import Button from '@mui/material/Button'
import { useColorScheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

// eslint-disable-next-line no-unused-vars
function ModeSelect() {
  const { mode, setMode } = useColorScheme()

  const handleChange = (event) => {
    const selectMode = event.target.value
    setMode(selectMode)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value='light'>
          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
            <LightModeIcon fontSize='small'/>Light
          </Box>
        </MenuItem>
        <MenuItem value='dark'>
          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
            <DarkModeIcon fontSize='small'/>Dark
          </Box>
        </MenuItem>
        <MenuItem value='system'>
          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
            <SettingsBrightnessIcon fontSize='small'/>System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

// eslint-disable-next-line no-unused-vars
function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
}

function App() {
  return (
    <>
      <ModeSelect/>
      <hr></hr>
      <ModeToggle/>
      <hr></hr>
      <div>luan</div>
      <Button variant="contained">Contained</Button>
    </>
  )
}

export default App
