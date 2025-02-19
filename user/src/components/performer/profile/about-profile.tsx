import { formatDate } from '@lib/date';
import { Collapse, Descriptions } from 'antd';
import { IPerformer } from 'src/interfaces';
import { COUNTRIES } from 'src/constants/countries';
import classNames from 'classnames';
import { ImageWithFallback } from '@components/common';
import style from './about-profile.module.scss';

type IProps = {
  performer: IPerformer;
  defaultActiveKey?: any;
}

export function AboutPerformer({
  performer, defaultActiveKey
}: IProps) {
  if (!performer) return null;
  const country = performer?.country && COUNTRIES.find((c) => c.code === performer.country);

  // const replaceURLs = (str: string) => {
  //   if (!str) return 'No bio yet';

  //   const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  //   const result = str.replace(urlRegex, (url: string) => {
  //     let hyperlink = url;
  //     if (!hyperlink.match('^https?:\\/\\/')) {
  //       hyperlink = `http://${hyperlink}`;
  //     }
  //     return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  //   });

  //   return result;
  // };

  const renderCountry = () => {
    if (!country) return 'BIOGRAPHY';

    return (
      <>
        {country && (
          <ImageWithFallback
            options={{
              width: 50,
              height: 50,
              sizes: '10vw',
              style: { height: 20, width: 'auto' }
            }}
            alt="flag"
            src={country.flag}
          />
        )}
        &nbsp;
        {country.name || ''}
      </>
    );
  };

  return (
    <div className={classNames(
      style['about-block']
    )}
    >
      <Collapse defaultActiveKey={defaultActiveKey} bordered={false} accordion>
        <Collapse.Panel
          header={renderCountry()}
          key="1"
        >
          <div
            className={style.bio}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: performer.bio || 'No bio yet...' }}
          />
          <Descriptions className={style['performer-info']}>
            {performer.gender && (
              <Descriptions.Item label="Gender">
                {performer.gender}
              </Descriptions.Item>
            )}
            {performer.sexualOrientation && <Descriptions.Item label="Sexual orientation">{performer.sexualOrientation}</Descriptions.Item>}
            {performer.dateOfBirth && <Descriptions.Item label="Date of Birth">{formatDate(performer.dateOfBirth, 'DD/MM/YYYY')}</Descriptions.Item>}
            {performer.bodyType && <Descriptions.Item label="Body Type">{performer.bodyType}</Descriptions.Item>}
            {performer.state && <Descriptions.Item label="State">{performer.state}</Descriptions.Item>}
            {performer.city && <Descriptions.Item label="City">{performer.city}</Descriptions.Item>}
            {performer.height && <Descriptions.Item label="Height">{performer.height}</Descriptions.Item>}
            {performer.weight && <Descriptions.Item label="Weight">{performer.weight}</Descriptions.Item>}
            {performer.eyes && <Descriptions.Item label="Eye color">{performer.eyes}</Descriptions.Item>}
            {performer.ethnicity && <Descriptions.Item label="Ethnicity">{performer.ethnicity}</Descriptions.Item>}
            {performer.hair && <Descriptions.Item label="Hair color">{performer.hair}</Descriptions.Item>}
            {performer.butt && <Descriptions.Item label="Butt size">{performer.butt}</Descriptions.Item>}
          </Descriptions>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}

AboutPerformer.defaultProps = {
  defaultActiveKey: null
};

export default AboutPerformer;
