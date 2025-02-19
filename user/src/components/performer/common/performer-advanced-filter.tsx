import { useEffect, useState } from 'react';
import {
  Input, Button, Select, Form
} from 'antd';
import { isNil, omitBy, debounce } from 'lodash';
import { ArrowUpOutlined, ArrowDownOutlined, FilterOutlined } from '@ant-design/icons';
import { IPerformerCategory } from '@interfaces/performer-category';
import { performerCategoryService } from '@services/perfomer-category.service';
import classNames from 'classnames';
import {
  AGES, BODY_TYPES, BUTTS, COUNTRIES, ETHNICITIES, EYES, GENDERS, HAIRS, HEIGHTS, SEXUAL_ORIENTATIONS, WEIGHTS
} from 'src/constants';
import { ImageWithFallback } from '@components/common';
import style from './performer-advanced-filter.module.scss';

interface IProps {
  onSubmit: Function;
}

function PerformerAdvancedFilter({
  onSubmit
}: IProps) {
  const [showMore, setShowMore] = useState(false);
  const [categories, setCategories] = useState<IPerformerCategory[]>([]);

  const handleSubmit = debounce((changedVal, allVal) => {
    const submitData = { ...allVal };
    // eslint-disable-next-line no-nested-ternary
    submitData.isFreeSubscription = submitData.isFreeSubscription === 'false' ? false : submitData.isFreeSubscription === 'true' ? true : '';
    onSubmit(omitBy(submitData, isNil));
  }, 600);

  const getData = async () => {
    const [categoriesResp] = await Promise.all([
      performerCategoryService.search()
    ]);
    setCategories(categoriesResp.data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Form
      style={{ width: '100%' }}
      onValuesChange={handleSubmit}
    >
      <div className={classNames(style['filter-block'], style.custom)}>
        <Form.Item className={classNames(style['filter-item'], style['item-30'])} name="q">
          <Input
            allowClear
            placeholder="Enter keyword"
          />
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-20'])} name="isFeatured">
          <Select style={{ width: '100%' }} defaultValue="">
            <Select.Option value="">
              All creators
            </Select.Option>
            <Select.Option value="true">
              Featured
            </Select.Option>
            <Select.Option value="false">
              Non-featured
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-20'])} name="categoryIds">
          <Select style={{ width: '100%' }} defaultValue="">
            <Select.Option value="">
              All Categories
            </Select.Option>
            {categories.map((c) => (
              <Select.Option key={c._id} value={c._id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-10'])} name="sortBy">
          <Select style={{ width: '100%' }} defaultValue="live">
            <Select.Option value="" disabled>
              <FilterOutlined />
              {' '}
              Sort By
            </Select.Option>
            <Select.Option value="popular">
              Popular
            </Select.Option>
            <Select.Option label="" value="latest">
              Latest
            </Select.Option>
            <Select.Option value="oldest">
              Oldest
            </Select.Option>
            <Select.Option value="online">
              Online
            </Select.Option>
            <Select.Option value="live">
              Live
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-20'])}>
          <Button
            className="primary"
            style={{ width: '100%' }}
            onClick={() => setShowMore(!showMore)}
          >
            Advanced search
            {' '}
            {showMore ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          </Button>
        </Form.Item>
      </div>
      <div className={classNames(style['filter-block'], style['filter-dropdown'], {
        [style.hide]: !showMore
      })}
      >
        <Form.Item className={style['filter-item']} name="isFreeSubscription">
          <Select
            style={{ width: '100%' }}
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All subscriptions
            </Select.Option>
            <Select.Option key="false" value="false">
              Non-free subscription
            </Select.Option>
            <Select.Option key="true" value="true">
              Free subscription
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="country">
          <Select
            style={{ width: '100%' }}
            placeholder="Countries"
            defaultValue=""
            showSearch
            optionFilterProp="label"
          >
            <Select.Option key="All" label="" value="">
              All countries
            </Select.Option>
            {COUNTRIES.map((c) => (
              <Select.Option key={c.code} label={c.name} value={c.code}>
                <ImageWithFallback
                  options={{
                    width: 40,
                    height: 40
                  }}
                  alt="flag"
                  src={c.flag}
                />
                &nbsp;
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="gender">
          <Select
            style={{ width: '100%' }}
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All genders
            </Select.Option>
            {GENDERS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="sexualOrientation">
          <Select
            style={{ width: '100%' }}
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All sexual orientations
            </Select.Option>
            {SEXUAL_ORIENTATIONS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="age">
          <Select
            style={{ width: '100%' }}
            placeholder="Age"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All ages
            </Select.Option>
            {AGES.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="eyes">
          <Select
            style={{ width: '100%' }}
            placeholder="Eye color"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All eye colors
            </Select.Option>
            {EYES.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="hair">
          <Select
            style={{ width: '100%' }}
            placeholder="Hair color"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All hair colors
            </Select.Option>
            {HAIRS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="butt">
          <Select
            style={{ width: '100%' }}
            placeholder="Butt size"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All butt size
            </Select.Option>
            {BUTTS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="height">
          <Select
            style={{ width: '100%' }}
            placeholder="Height"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All heights
            </Select.Option>
            {HEIGHTS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="weight">
          <Select
            style={{ width: '100%' }}
            placeholder="Weight"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All weights
            </Select.Option>
            {WEIGHTS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="ethnicity">
          <Select
            style={{ width: '100%' }}
            placeholder="Ethnicity"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All ethnicities
            </Select.Option>
            {ETHNICITIES.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="bodyType">
          <Select
            style={{ width: '100%' }}
            placeholder="Body type"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All body types
            </Select.Option>
            {BODY_TYPES.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
}

export default PerformerAdvancedFilter;
