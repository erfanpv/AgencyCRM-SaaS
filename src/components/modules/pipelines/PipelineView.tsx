'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { Flag, Plus } from 'lucide-react';
import { type Lane, type Ticket } from '@prisma/client';

import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/ui/button';
import CustomModal from '@/components/global/CustomModal';
import LaneDetails from '@/components/forms/LaneDetails';
import PipelineLane from './PipelineLane';

import type {
  LaneDetails as LaneDetailsType,
  PipelineDetailsWithLanesCardsTagsTickets,
  TicketAndTags,
} from '@/lib/types';

interface PipelineViewProps {
  lanes: LaneDetailsType[];
  pipelineId: string;
  subAccountId: string;
  pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets;
  updateLanesOrder: (lanes: Lane[]) => Promise<void>;
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
}

const PipelineView: React.FC<PipelineViewProps> = ({
  lanes,
  pipelineDetails,
  pipelineId,
  subAccountId,
  updateLanesOrder,
  updateTicketsOrder,
}) => {
  const router = useRouter();
  const { setOpen } = useModal();

  const [allLanes, setAllLanes] = React.useState<LaneDetailsType[]>(lanes);
  const [allTickets, setAllTickets] = React.useState<TicketAndTags[]>([]);

  React.useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const handleAddLane = () => {
    setOpen(
      <CustomModal
        title="Create a Lane"
        subTitle="Lanes allow you to group tickets"
        scrollShadow={false}
      >
        <LaneDetails pipelineId={pipelineId}></LaneDetails>
      </CustomModal>,
    );
  };

  const onDragEnd = () => {};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="use-automation-zoom-in rounded-md bg-white/60 p-4 dark:bg-background/60">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{pipelineDetails?.name}</h1>
          <Button
            className="inline-flex items-center gap-2"
            onClick={handleAddLane}
          >
            <Plus className="h-4 w-4" /> Create Lane
          </Button>
        </div>
        <Droppable
          droppableId="lanes"
          type="lane"
          direction="horizontal"
          key="lanes"
          isDropDisabled={false}
        >
          {provided => (
            <div
              className="flex items-center gap-x-2 overflow-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="mt-4 flex items-start gap-3">
                {allLanes.map((lane, index) => (
                  <PipelineLane
                    key={lane.id}
                    allTickets={allTickets}
                    setAllTickets={setAllTickets}
                    subAccountId={subAccountId}
                    pipelineId={pipelineId}
                    tickets={lane.tickets}
                    laneDetails={lane}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
        {!allLanes.length && (
          <div className="flex w-full flex-col items-center justify-center gap-2 pb-10 text-muted-foreground">
            <Flag className="h-32 w-32 opacity-100" />
            <p className="text-xs font-medium">
              You don&apos;t have any lanes. Go create one!
            </p>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default PipelineView;
