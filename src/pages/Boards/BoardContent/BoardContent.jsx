import Box from '@mui/material/Box';
import ListColumns from './ListComlumns/ListColumns';
import { mapOrder } from '~/utils/sorts';

import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import Column from './ListComlumns/Column/Column';
import Card from './ListComlumns/Column/ListCards/Card/Card';

const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
    CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
};
function BoardContent({ board }) {
    // Yeu cau chuot di chuyen 10px thi moi goi event, fix truong hop click bi goi event
    const mouserSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });

    // Nhan giu 250ms va dung sai cua cam ung 500px thi moi kich hoat event
    const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });

    // const mySensors = useSensors(pointerSensor);
    // Uu tien su dung ket hop 2 loai sensor la mouse va touch de co trai nghiem tren mobile tot nhat, khong bi bug
    const mySensors = useSensors(mouserSensor, touchSensor);

    const [oderedColumns, setOderedColumns] = useState([]);

    // Cung mot thoi diem chi co mot phan tu dang duoc keo(Column hoac Card)
    const [activeDragItemId, setActiveDragItemId] = useState(null);
    const [activeDragItemType, setActiveDragItemType] = useState(null);
    const [activeDragItemData, setActiveDragItemData] = useState(null);

    useEffect(() => {
        setOderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
    }, [board]);

    const handleDragStart = (e) => {
        // console.log('handleDragStart: ', e);
        setActiveDragItemId(e?.active?.id);
        setActiveDragItemType(
            e?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN,
        );
        setActiveDragItemData(e?.active?.data?.current);
    };

    const findColumnByCardId = (cardId) => {
        return oderedColumns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId));
    };
    // Trigger trong qua trinh keo  phan tu
    const handleDragOver = (e) => {
        // Neu dang keo Column thi return
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

        // Neu keo card thi xu ly them de co the keo card qua lai giua cac column
        const { active, over } = e;

        //Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì ko làm gì (tránh crash trang)
        if (!active || !over) return;

        // activeDragingCardId: Dang duoc keo
        const {
            id: activeDragingCardId,
            data: { current: activeDragingCardData },
        } = active;
        // overCardId: Card dang tuong tac tren hoac duoi so vs card duoc keo o tren
        const { id: overCardId } = over;

        // Tim 2 column theo CardId
        const activeColumn = findColumnByCardId(activeDragingCardId);
        const overColumn = findColumnByCardId(overCardId);

        if (!activeColumn || !overColumn) return;
        if (activeColumn._id !== overColumn._id) {
            setOderedColumns((prevColumns) => {
                // Tìm vị trí(index) của overCard trong Column đích (nơi ma activeCard sắp được thả)
                const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId);

                // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
                let newCardIndex;
                const isBelowOverItem =
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;
                const modifier = isBelowOverItem ? 1 : 0;
                newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;

                //Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
                const nextColumns = cloneDeep(prevColumns);
                const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id);
                const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id);

                if (nextActiveColumn) {
                    nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => card._id !== activeDragingCardId);

                    nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id);
                }
                if (nextOverColumn) {
                    nextOverColumn.cards = nextOverColumn.cards.filter((card) => card._id !== activeDragingCardId);
                    nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDragingCardData);

                    nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id);
                }

                return nextColumns;
            });
        }
    };

    const handleDragEnd = (e) => {
        // console.log('handleDragEnd: ', e);

        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
            return;
        }

        const { active, over } = e;

        // Kiem tra neu ko ton tai over (Keo linh tinh ra ngoai thi return luon tranh loi)
        if (!active || !over) return;

        if (active.id !== over.id) {
            // Lay vi tri cu (tu thang active)
            const oldIndex = oderedColumns.findIndex((c) => c._id === active.id);
            // Lay vi tri moi (tu thang active)
            const newIndex = oderedColumns.findIndex((c) => c._id === over.id);

            const dndOderedColumns = arrayMove(oderedColumns, oldIndex, newIndex);
            setOderedColumns(dndOderedColumns);
        }

        setActiveDragItemId(null);
        setActiveDragItemType(null);
        setActiveDragItemData(null);
    };

    const customDropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } },
        }),
    };
    return (
        <DndContext
            sensors={mySensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <Box
                sx={{
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
                    width: '100%',
                    height: (theme) => theme.trello.boardContentHeight,
                    p: '10px 0',
                }}
            >
                <DragOverlay dropAnimation={customDropAnimation}>
                    {!activeDragItemData && null}
                    {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
                    {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
                </DragOverlay>
                <ListColumns columns={oderedColumns} />
            </Box>
        </DndContext>
    );
}

export default BoardContent;
