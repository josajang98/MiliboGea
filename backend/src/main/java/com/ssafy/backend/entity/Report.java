package com.ssafy.backend.entity;


import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Report {

    @Id
    @GeneratedValue
    @Column(name="report_id")
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private String state;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="board_id")
    private Board board;

}
