/** Source files (Cursor workspace storage) → hero slideshow filenames. */
export const HERO_SLIDESHOW_SOURCES = [
  {
    slug: 'hero-slideshow-01-pamulak-float',
    source:
      '788848737_28404503025854568_752442233545290317_n-83c86e82-d687-45b2-9d55-0230a335e567.jpg',
  },
  {
    slug: 'hero-slideshow-02-sandbar-aerial',
    source:
      '788859807_854190811113129_5121149711407538612_n-27d77d44-7c06-431e-bb27-30ff21403a03.jpg',
  },
  {
    slug: 'hero-slideshow-03-bay-coastline',
    source:
      '788877294_1603659391162217_5703020394702205152_n-fa6f4753-a62c-45f8-b89c-5449e5977cea.jpg',
  },
  {
    slug: 'hero-slideshow-04-traditional-feast',
    source:
      '789060125_1792782181871669_4392710842615898725_n-3f453a5d-30cf-43c4-85d1-0d094b7ac3b9.jpg',
  },
  {
    slug: 'hero-slideshow-05-landmark-building',
    source:
      '789706207_1768281177630425_8896175206271333012_n-f2e72df0-7023-4091-8172-aabd7c8650b0.jpg',
  },
  {
    slug: 'hero-slideshow-06-waterfalls',
    source:
      '789299036_1387867800133842_5898543034639015431_n-899ebe76-4bb0-4f9d-afb8-2f62a897ec35.jpg',
  },
  {
    slug: 'hero-slideshow-07-durian',
    source:
      '790111404_3716358678517523_8300749120759644526_n-7785a81b-f959-473b-905c-812fba107543.jpg',
  },
  {
    slug: 'hero-slideshow-08-beach-aerial',
    source:
      '790424366_1415609927162378_7688068628516493038_n-d8d395c7-782e-43de-a1ac-15e66121313b.jpg',
  },
  {
    slug: 'hero-slideshow-09-rock-pools',
    source:
      '790993144_2906196463111991_7416679269080413666_n-40acf544-24a8-43de-9bf5-a4ad83c9538a.jpg',
  },
  {
    slug: 'hero-slideshow-10-kudyapi-music',
    source:
      '791599416_4623788727947332_367666455873855409_n-d36a6aff-227d-49b5-a70e-468bdb34ecf5.jpg',
  },
  {
    slug: 'hero-slideshow-11-maranao-royal-house',
    source:
      '791142629_1608614137601243_1327048168051862828_n-f71029b2-f0f0-4bec-b6b1-c184bdd544e9.jpg',
  },
  {
    slug: 'hero-slideshow-12-tribal-portrait',
    source:
      '791888819_1397414542482746_756683488084399269_n-cd381188-f024-4f89-909d-251814906c3a.jpg',
  },
  {
    slug: 'hero-slideshow-13-coconut-coast',
    source:
      '791974045_1708904637002684_4601462690158270567_n-282aad01-bef7-4c93-b34e-d4c73b90e743.jpg',
  },
  {
    slug: 'hero-slideshow-14-traditional-snacks',
    source:
      '792403109_1386264442926065_6409781089574666395_n-c0d24798-67b8-4402-9080-6ff24c485495.jpg',
  },
  {
    slug: 'hero-slideshow-15-maranao-dance',
    source:
      '792820351_4375811319340479_765712944546077575_n-709975a6-54ee-4dd1-943f-2edcb87297dd.jpg',
  },
  {
    slug: 'hero-slideshow-16-durian-harvest',
    source:
      '787999633_1948852932751980_3563856549296507274_n-3cafd602-dffb-46e0-8a2b-51fd6bbaba91.jpg',
  },
  {
    slug: 'hero-slideshow-17-sunken-cemetery',
    source:
      '792458708_2384430442095357_8518591894149588570_n-7740873d-8d90-42cb-af79-f9110b9ed44c.jpg',
  },
  {
    slug: 'hero-slideshow-18-island-sandbar',
    source:
      '788337659_1104560028918205_2976788111324169727_n-b2cf55e2-eeef-440f-894b-6ae67e04bcd6.jpg',
  },
  {
    slug: 'hero-slideshow-19-mountain-valley',
    source:
      '788493655_2340390356712661_8725141707382054318_n-67de86c4-619e-47cd-b38f-87e7e158a4e3.jpg',
  },
  {
    slug: 'hero-slideshow-20-siargao-lagoon',
    source:
      '788591424_4045630395731296_6485138676219004059_n-d6cc718e-403c-4580-b3a6-5a6a5b2b151f.jpg',
  },
  {
    slug: 'hero-slideshow-21-cold-spring',
    source:
      '792863274_1373134031576016_5699463656692826789_n-9bd03d62-b6cc-4d14-baa0-82b645e96cb7.jpg',
  },
  {
    slug: 'hero-slideshow-22-beach-topdown',
    source:
      '788665717_2144352126499240_3896585496738733172_n-506190f7-5d38-46ed-8fa6-105877a49da3.jpg',
  },
  {
    slug: 'hero-slideshow-23-grand-mosque',
    source:
      '789059655_1598837151910529_8112023695892393084_n-801e35cd-489a-4efa-b1e7-9f84baf24ad3.jpg',
  },
  {
    slug: 'hero-slideshow-24-mountain-pond',
    source:
      '791453394_1448602797110650_6147786108834328529_n-f55df941-1087-4125-8936-0c2050f235be.jpg',
  },
]

export const HERO_SLIDESHOW_PATHS = HERO_SLIDESHOW_SOURCES.map(
  ({ slug }) => `/images/hero/${slug}.jpg`,
)

export const HERO_SLIDESHOW_FILENAMES = HERO_SLIDESHOW_SOURCES.map(({ slug }) => `${slug}.jpg`)
