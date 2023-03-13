import { useEffect, useState, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'

import DetailsCard from '~/components/ui/molecules/DetailsCard'
import usePodcast from '~/hooks/query/usePodcast'
import usePodcastInfo from '~/hooks/query/usePodcastInfo'
import { type Item } from '~/interfaces/PodcastInfo'

function PodcastEpisodePage(): ReactElement {
  const params = useParams<{
    podcastId: string | undefined
    episodeId: string | undefined
  }>()

  const { data: podcast } = usePodcast(params.podcastId ?? '')

  const { data: podcastInfo } = usePodcastInfo(
    params.podcastId ?? '',
    podcast?.feedUrl ?? ''
  )

  const [episode, setEpisode] = useState<Item>()

  useEffect(() => {
    setEpisode(podcastInfo?.item.find(i => i.guid.text === params.episodeId))
  }, [podcastInfo?.item])

  return (
    <div className='container w-full flex flex-col items-center md:items-start md:flex-row gap-3 lg:gap-24 mx-auto pt-8 pb-9 px-4'>
      <DetailsCard
        image={{ src: podcast?.artworkUrl600, alt: podcast?.collectionName }}
        title={podcast?.collectionName}
        author={podcast?.artistName}
        description={podcastInfo?.itunesSummary}
      />
      <div className='w-full  bg-base-100 drop-shadow-lg flex flex-col gap-5 border border-base-200 p-5'>
        <span className=' text-xl font-bold'>{episode?.title}</span>
        <div
          className='flex flex-col gap-2'
          dangerouslySetInnerHTML={{ __html: episode?.contentEncoded ?? '' }}
        ></div>

        <audio
          className='w-full'
          src={episode?.enclosure?.url}
          controls
        ></audio>
      </div>
    </div>
  )
}

export default PodcastEpisodePage
