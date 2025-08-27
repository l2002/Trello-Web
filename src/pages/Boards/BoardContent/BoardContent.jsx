import Box from '@mui/material/Box';
import ListColumns from './ListComlumns/ListColumns';
import { mapOrder } from '~/utils/sorts';

import { DndContext, PointerSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { useEffect, useState } from 'react';

function BoardContent({ board }) {
    const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

    // Yeu cau chuot di chuyen 10px thi moi goi event, fix truong hop click bi goi event
    const mouserSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });

    // Nhan giu 250ms va dung sai cua cam ung 500px thi moi kich hoat event
    const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });

    // const mySensors = useSensors(pointerSensor);
    // Uu tien su dung ket hop 2 loai sensor la mouse va touch de co trai nghiem tren mobile tot nhat, khong bi bug
    const mySensors = useSensors(mouserSensor, touchSensor);

    const [oderedColumns, setOderedColumns] = useState([]);

    useEffect(() => {
        setOderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
    }, [board]);

    const handleDragEnd = (e) => {
        console.log('handleDragEnd: ', e);
        const { active, over } = e;

        // Kiem tra neu ko ton tai over (Keo linh tinh ra ngoai thi return luon tranh loi)
        if (!over) return;

        if (active.id !== over.id) {
            // Lay vi tri cu (tu thang active)
            const oldIndex = oderedColumns.findIndex((c) => c._id === active.id);
            // Lay vi tri moi (tu thang active)
            const newIndex = oderedColumns.findIndex((c) => c._id === over.id);

            const dndOderedColumns = arrayMove(oderedColumns, oldIndex, newIndex);
            setOderedColumns(dndOderedColumns);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd} sensors={mySensors}>
            <Box
                sx={{
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
                    width: '100%',
                    height: (theme) => theme.trello.boardContentHeight,
                    p: '10px 0',
                }}
            >
                <ListColumns columns={oderedColumns} />
            </Box>
        </DndContext>
    );
}

export default BoardContent;
