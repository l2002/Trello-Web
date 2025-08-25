import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { capitalizeFirstLetter } from '~/utils/formatter';

const MENU_STYLES = {
    color: 'white',
    bgcolor: 'transparent',
    border: 'none',
    paddingX: '5px',
    borderRadius: '4px',
    '.MuiSvgIcon-root': {
        color: 'white',
    },
    '&:hover': {
        bgcolor: 'primary.50',
    },
};

function BoardBar({ board }) {
    return (
        <Box
            sx={{
                width: '100%',
                height: (theme) => theme.trello.boardBarHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                paddingX: 2,
                overflowX: 'auto',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip sx={MENU_STYLES} icon={<DashboardIcon />} label={board?.title} clickable />
                <Chip sx={MENU_STYLES} icon={<VpnLockIcon />} label={capitalizeFirstLetter(board?.type)} clickable />
                <Chip sx={MENU_STYLES} icon={<AddToDriveIcon />} label="Add To Google Drive" clickable />
                <Chip sx={MENU_STYLES} icon={<BoltIcon />} label="Automation" clickable />
                <Chip sx={MENU_STYLES} icon={<FilterListIcon />} label="Filters" clickable />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<PersonAddIcon />}
                    sx={{
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': { borderColor: 'white' },
                    }}
                >
                    Invite
                </Button>

                <AvatarGroup
                    max={5}
                    sx={{
                        gap: '10px',
                        '& .MuiAvatar-root': {
                            width: 34,
                            height: 34,
                            fontSize: 16,
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            '&:first-of-type': { bgcolor: '#a4b0be' },
                        },
                    }}
                >
                    <Tooltip title="nguyenminhluan">
                        <Avatar
                            alt="nguyenminhluan"
                            src="https://p16-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/f6f14aefe7d3504ad9037940e83653d3~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=96226477&x-expires=1755666000&x-signature=sIzEZQd6R2eazqa4UoAi612jK%2BY%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my2"
                        />
                    </Tooltip>
                    <Tooltip title="nguyenminhluan">
                        <Avatar
                            alt="nguyenminhluan"
                            src="https://p16-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/f6f14aefe7d3504ad9037940e83653d3~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=96226477&x-expires=1755666000&x-signature=sIzEZQd6R2eazqa4UoAi612jK%2BY%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my2"
                        />
                    </Tooltip>
                    <Tooltip title="nguyenminhluan">
                        <Avatar
                            alt="nguyenminhluan"
                            src="https://p16-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/f6f14aefe7d3504ad9037940e83653d3~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=96226477&x-expires=1755666000&x-signature=sIzEZQd6R2eazqa4UoAi612jK%2BY%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my2"
                        />
                    </Tooltip>
                    <Tooltip title="nguyenminhluan">
                        <Avatar
                            alt="nguyenminhluan"
                            src="https://p16-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/f6f14aefe7d3504ad9037940e83653d3~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=96226477&x-expires=1755666000&x-signature=sIzEZQd6R2eazqa4UoAi612jK%2BY%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my2"
                        />
                    </Tooltip>
                    <Tooltip title="nguyenminhluan">
                        <Avatar
                            alt="nguyenminhluan"
                            src="https://p16-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/f6f14aefe7d3504ad9037940e83653d3~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=96226477&x-expires=1755666000&x-signature=sIzEZQd6R2eazqa4UoAi612jK%2BY%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my2"
                        />
                    </Tooltip>
                    <Tooltip title="nguyenminhluan">
                        <Avatar
                            alt="nguyenminhluan"
                            src="https://p16-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/f6f14aefe7d3504ad9037940e83653d3~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=96226477&x-expires=1755666000&x-signature=sIzEZQd6R2eazqa4UoAi612jK%2BY%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my2"
                        />
                    </Tooltip>
                    <Tooltip title="nguyenminhluan">
                        <Avatar
                            alt="nguyenminhluan"
                            src="https://p16-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/f6f14aefe7d3504ad9037940e83653d3~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=96226477&x-expires=1755666000&x-signature=sIzEZQd6R2eazqa4UoAi612jK%2BY%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my2"
                        />
                    </Tooltip>
                </AvatarGroup>
            </Box>
        </Box>
    );
}

export default BoardBar;
