import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import * as Api from "../../api";
import { isSameDay, isAfter } from "date-fns";

const ProjectAddForm = ({ isAdding, portfolioOwnerId, setProjects }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartDateChange = (startDate) => {
    if (isSameDay(startDate, form.endDate)) {
      setForm({ ...form, startDate });
    }
    if (isAfter(startDate, form.endDate)) {
      setForm({ ...form, startDate: startDate, endDate: startDate });
    } else {
      setForm({ ...form, startDate });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = portfolioOwnerId;
    try {
      await Api.post("project/create", {
        ...form,
      });

      const { data } = await Api.get("projects", userId);
      setProjects(data);

      isAdding(false);
    } catch (err) {
      console.log("추가가 정상적으로 이루어지지 않았습니다.", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formProjectTitle">
        <Form.Control
          type="text"
          name="title"
          placeholder="프로젝트 제목"
          value={form.title}
          onChange={handleChangeInput}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formProjectDescription">
        <Form.Control
          type="text"
          name="description"
          placeholder="상세내역"
          value={form.description}
          onChange={handleChangeInput}
        />
      </Form.Group>

      <Row className="mt-3 mb-3">
        <Form.Group sm="auto" as={Col}>
          <DatePicker
            selected={form.startDate}
            onChange={handleStartDateChange}
            value={form.startDate}
            selectsStart
            startDate={form.startDate}
            endDate={form.endDate}
          />
        </Form.Group>
        <Form.Group sm="auto" as={Col}>
          <span style={{ fontSize: 20 }}>~</span>
        </Form.Group>
        <Form.Group sm="auto" as={Col}>
          <DatePicker
            selected={form.endDate}
            onChange={(endDate) => setForm({ ...form, endDate })}
            value={form.endDate}
            selectsEnd
            startDate={form.startDate}
            endDate={form.endDate}
            minDate={form.startDate}
          />
        </Form.Group>
      </Row>

      <Form.Group as={Row} className="mt-3 mb-3 text-center">
        <Col sm={{ span: 20 }}>
          <Button variant="primary" type="submit" className="me-3">
            확인
          </Button>
          <Button variant="secondary" onClick={() => isAdding(false)}>
            취소
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default ProjectAddForm;
