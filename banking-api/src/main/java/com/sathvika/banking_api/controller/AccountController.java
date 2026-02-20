package com.sathvika.banking_api.controller;

import com.sathvika.banking_api.entity.Account;
import com.sathvika.banking_api.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @GetMapping("/balance/{customerId}")
    public String getCustomerBalance(@PathVariable Long customerId) {
        return "Customer ID " + customerId + " → Check H2 ACCOUNTS table";
    }
}







