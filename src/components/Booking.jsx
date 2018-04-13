import _debug from "debug";
import { Component } from 'react';
import { connect } from "../state/RxState";
import PropTypes from "prop-types";

import flatten from 'array-flatten';
import toCase from 'to-case';

import { bookingActions } from "../actions";

import Loading from './Loading.jsx';

import {
  Button,
  ButtonGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'my-ui-components';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardText,
} from 'my-ui-components';

import { Carousel } from 'my-ui-components';

import { moment, accounting } from 'my-accounting';

import appCss from '../css/app.css';
import bookingCss from '../css/booking.css';

const debug = _debug("components:booking")

const getDiscount = (price, modifier) => {

  let discounted,
      discountStr,
      amount,
      unit;


  if (modifier) {

    ({amount, unit} = modifier);

    if (unit == 'percent') {
      discounted = price + (price*amount/100);
      discountStr = Math.abs(amount)+'%';
    }
    else if (unit == 'currency') {
      discounted = amount + price;
      discountStr = accounting.currency(Math.abs(amount));
    }
  }

  return {
    discounted: discounted,
    discountStr: discountStr,
  }
}


const serviceDatesListFilter = (selectedVariant, serviceDatesList) => serviceDatesList
  .filter(serviceDate => serviceDate.variants.filter(variant => variant.id == selectedVariant.id && variant.count).length)


const serviceDateVariantsListFilterTimeslots = (selectedVariant, serviceDateVariantsList) => {
  const timeslotsList = serviceDateVariantsList
    .filter(variant => variant.id == selectedVariant.id)
    .map(variant => variant.timeslotsList)
    .filter(timeslotsList => timeslotsList.length);

  return timeslotsList[0]||[];
}

const DateCard = ({selectedVariant, serviceDate, onClick}) => {

  const variantAvailability = serviceDate.variants.reduce((acc, cur) => {
    acc[cur.id] = cur.count;
    return acc;
  }, {});

  return (
    <div styleName="bookingCss.card-container">
      <Card>

        <CardHeader>
          <CardTitle>
            {moment(serviceDate.date, "YYYY-MM-DD").format("DD.MM.YYYY")}
          </CardTitle>

          <CardText>
            {toCase.sentence(moment(serviceDate.date, "YYYY-MM-DD").format("dddd"))}
          </CardText>
        </CardHeader>

        <CardBody>
          <h3>{selectedVariant.name}</h3>
          <CardText>
            {variantAvailability[selectedVariant.id]} tider tilgjengelig
          </CardText>
        </CardBody>

        <CardFooter>
          <Button color="primary"onClick={onClick}>Se tider</Button>
        </CardFooter>

      </Card>
    </div>
  );
}


const TimeCard = ({selectedVariant, timeslot, onClick}) => {

  const totalCapacity = timeslot.resourcesList.reduce((acc, cur) => {
    return acc+cur.capacity;
  }, 0)


  return (
    <div styleName="bookingCss.card-container">
      <Card>

        <CardHeader>
          <CardTitle>
            {timeslot.startTime}
          </CardTitle>
          {totalCapacity} ledige plasser.
        </CardHeader>

        <CardBody>
          <Carousel dots={true} arrows={true}>
            <For each="resource" of={timeslot.resourcesList}>
              <With discount={getDiscount(selectedVariant.price, resource.priceModifier)}>
                <div class="carousel-item">
                  <Button color="primary"onClick={()=>onClick({
                    ...resource,
                    price: discount.discounted || selectedVariant.price}
                  )}>Reserver time</Button>
                  <span className="spacer" />
                  Med {resource.serviceProvider.fullname}
                  <Price price={selectedVariant.price} discount={discount} />
                  {resource.capacity} plasser
                </div>
              </With>
            </For>
          </Carousel>
        </CardBody>

        <CardFooter>
          <h3>{selectedVariant.name}</h3>
        </CardFooter>
      </Card>
    </div>
  );
}

const Price = ({price, discount}) => {

  const {discounted, discountStr} = discount;

  return (
    <span styleName="bookingCss.prices">
      <If condition={discounted}>
        <span class="discount">{discountStr} rabatt!</span>
        <del class="original modified">{accounting.currency(price)}</del>
        <span class="original">Nå kun {accounting.currency(discounted)}</span>
      </If>
      <If condition={!discounted}>
        <span class="original">{accounting.currency(price)}</span>
      </If>
    </span>
  );
}

const DropdowmWidget = ({items, selectedItem, onClick=()=>{}}) => {
  return (
    <UncontrolledDropdown group>

      <DropdownToggle caret color="primary">
        {selectedItem.name}
      </DropdownToggle>

      <DropdownMenu>
        <For each="item" of={ items }>
          <DropdownItem
            onClick={()=>onClick(item.id)}
            key={item.id}>{ item.name }</DropdownItem>
        </For>
      </DropdownMenu>

    </UncontrolledDropdown>
  );
}


export const Booking = (props) => {
  debug("BOOKING.props", props)

  return (
    <div styleName="bookingCss.container">

      <If condition={props.servicesList}>
        <ButtonGroup>
          <DropdowmWidget
            items={props.servicesList}
            selectedItem={props.selectedService}
            onClick={(itemId)=>props.selectService$({serviceId: itemId})}
          />
          <DropdowmWidget
            items={props.selectedService.variants}
            selectedItem={props.selectedVariant}
            onClick={(itemId)=>props.selectVariant$({variantId: itemId})}
          />
        </ButtonGroup>
      </If>

      <If condition={props.serviceDatesList && props.serviceDatesList.length}>
        <div className="scroll-port" styleName="bookingCss.scroll-port">
          <div styleName="bookingCss.scroll-canvas">
            <For each="serviceDate" of={serviceDatesListFilter(props.selectedVariant, props.serviceDatesList)}>
              <DateCard
                selectedVariant={props.selectedVariant}
                serviceDate={serviceDate}
                onClick={()=>props.selectDate$({isoDateStr: serviceDate.date})}
              />
            </For>
          </div>
        </div>
      </If>


      <If condition={props.serviceDateVariantsList && props.serviceDateVariantsList.length}>
        <div className="scroll-port" styleName="bookingCss.scroll-port">
          <div styleName="bookingCss.scroll-canvas">
            <For each="timeslot" of={serviceDateVariantsListFilterTimeslots(props.selectedVariant, props.serviceDateVariantsList)}>
              <TimeCard
                selectedVariant={props.selectedVariant}
                timeslot={timeslot}
                onClick={(selectedResource)=>props.selectTimeslot$({
                  startTime: timeslot.startTime,
                  selectedResource: selectedResource,
                })}
              />
            </For>
          </div>
        </div>
      </If>

    </div>
  )
}



export default connect(({ booking }) => booking, bookingActions)(Booking);